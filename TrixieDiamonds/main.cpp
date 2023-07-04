#include <QCoreApplication>
#include <QObject>
#include <SFML/Graphics.hpp>
#include <SFML/System/Clock.hpp>
#include <SFML/Window/Keyboard.hpp>
#include <SFML/Window/Mouse.hpp>
#include <QtScript/QScriptEngine>
#include <QDir>
#include <QtGlobal>
#include "game.h"
#include "qgamesystem.h"
#include "extproc.h"
#include "mapviewer.h"

Game * createGame(const QString & scriptname, MapViewer & mapviewer, ExtProc & extproc) {
    Game * game = new Game("scripts/"+scriptname+".js") ;
    mapviewer.setEngine(&game->engine) ;
    game->addObjectToEngine("mapviewer",&mapviewer) ;

    QObject::connect(game->sys,SIGNAL(writeMessage(QString)),&extproc,SLOT(getMessage(QString))) ;
    QObject::connect(game->sys,SIGNAL(writePair(QString,QVariant)),&extproc,SLOT(getPair(QString,QVariant))) ;
    QObject::connect(game,SIGNAL(sendLog(QString)),&extproc,SLOT(getMessage(QString))) ;
    QObject::connect(game,SIGNAL(sendTitle(QString)),&extproc,SLOT(setTitle(QString))) ;
    QObject::connect(game->sys,SIGNAL(showCursor(bool)),&extproc,SLOT(switchCursor(bool))) ;

    return game ;
}

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    #if (defined (Q_OS_LINUX))
        // Поправка для корректного старта в AppImage
        if (QDir::current().path().endsWith("/usr"))
            QDir::setCurrent("data") ;
        else
            QDir::setCurrent("../data") ;
    #else
        QDir::setCurrent("../data") ;
    #endif

    sf::RenderWindow window(sf::VideoMode(800, 600),"MainWindow") ;
    window.setVerticalSyncEnabled(true);
    window.setFramerateLimit(60);

    ExtProc extproc(&window) ;
    MapViewer mapviewer(&window) ;

    Game * game = createGame("main",mapviewer,extproc);
    QScriptValue arrarg = game->engine.newObject() ;
    for (int i=0; i<argc; i++)
        arrarg.setProperty(i,game->engine.newVariant(argv[i])) ;
    arrarg.setProperty("length",argc);
    if (!game->Init(QGameSystem::ScriptValue2String(arrarg))) return 1 ;

    sf::Clock clock ;
    float lasttime = clock.getElapsedTime().asSeconds() ;

    while (window.isOpen())
    {
        a.processEvents() ;

        float newtime = clock.getElapsedTime().asSeconds() ;
        float dt = newtime-lasttime ;
        lasttime = newtime ;

        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                window.close() ;
                break ;
            }
            if (event.type == sf::Event::KeyPressed)
                game->setKey(event.key.code) ;
            if (event.type == sf::Event::MouseButtonPressed) {
                if (event.mouseButton.button==sf::Mouse::Button::Left) game->setLeftButtonClicked() ;
                if (event.mouseButton.button==sf::Mouse::Button::Right) game->setRightButtonClicked() ;
            }
        }

        game->setMousePos(sf::Mouse::getPosition(window).x,sf::Mouse::getPosition(window).y) ;

        if (!game->Frame(dt)) {
            window.close() ;
            break ;
        }

        if (game->isNewScript()) {
            QString script = game->getNewScript() ;            
            QString args  = QGameSystem::ScriptValue2String(game->getNewScriptArgs()) ;
            game->UnInit() ;
            delete game ;
            game = createGame(game->getNewScript(),mapviewer,extproc) ;
            if (!game->Init(args)) return 1 ;
            // Убираем слишком большую дельту, вызванную инициализацией новой игры
            lasttime = clock.getElapsedTime().asSeconds() ;
        }

        window.clear();
        game->Render(&window) ;
        window.display();
    }

    game->UnInit() ;
    delete game ;

    a.quit() ;
    return EXIT_SUCCESS ;
}
