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
#include "minimap.h"

const int WINDOW_WIDTH=800 ;
const int WINDOW_HEIGHT=600 ;

Game * createGame(const QString & scriptname, MapViewer & mapviewer, MiniMap & minimap, ExtProc & extproc) {
    Game * game = new Game("scripts/"+scriptname+".js") ;
    mapviewer.setEngine(&game->engine) ;
    game->addObjectToEngine("mapviewer",&mapviewer) ;
    game->addObjectToEngine("minimap",&minimap) ;

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

    QDir::setCurrent("../data") ;
#if (defined (Q_OS_LINUX))
    // Поправка для корректного старта в AppImage
    if (QDir::current().path().endsWith("/usr")) QDir::setCurrent("data") ;
#endif
#if (defined (Q_OS_MACOS))
    // Поправка для корректного старта в .app
    if (QDir::current().path().endsWith("/MacOS")) QDir::setCurrent("data") ;
#endif

    QString script="main" ;
    QString args="argv" ;

lab_reset_fullscreen:
    sf::Uint32 style ;
    if (isFullScreen()) style=sf::Style::Fullscreen ; else style=sf::Style::Close ;

    sf::RenderWindow window(sf::VideoMode(WINDOW_WIDTH, WINDOW_HEIGHT),"MainWindow",style) ;
    window.setVerticalSyncEnabled(true);
    window.setFramerateLimit(60);
    sf::Image ico ;
    if (ico.loadFromFile("sprites/icon.png"))
        window.setIcon(ico.getSize().x, ico.getSize().y, ico.getPixelsPtr());

    ExtProc extproc(&window) ;
    MapViewer mapviewer(&window) ;

    MiniMap minimap(&window) ;
    minimap.preloadMiniMaps(WINDOW_WIDTH,WINDOW_HEIGHT,0.125f) ;

    Game * game = createGame(script,mapviewer,minimap,extproc);
    if (args=="argv") {
        QScriptValue arrarg = game->engine.newObject() ;
        for (int i=0; i<argc; i++)
            arrarg.setProperty(i,game->engine.newVariant(argv[i])) ;
        arrarg.setProperty("length",argc);
        args = QGameSystem::ScriptValue2String(arrarg) ;
    }
    if (!game->Init(args)) return 1 ;

    sf::Clock clock ;
    float lasttime = clock.getElapsedTime().asSeconds() ;

    bool closehandled = false ;
    Game * prevgame = nullptr ;    
    while (window.isOpen())
    {
        a.processEvents() ;

        float newtime = clock.getElapsedTime().asSeconds() ;
        float dt = newtime-lasttime ;
        lasttime = newtime ;

        closehandled = false ;
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                if (game->sys->getCloseHandlerScript().length()==0) {
                    window.close() ;
                    break ;
                }
                else
                    closehandled = true ;
            }

            if (event.type == sf::Event::KeyPressed)
                game->setKey(event.key.code) ;
            if (event.type == sf::Event::MouseButtonPressed) {
                if (event.mouseButton.button==sf::Mouse::Button::Left) game->setLeftButtonClicked() ;
                if (event.mouseButton.button==sf::Mouse::Button::Right) game->setRightButtonClicked() ;
            }
        }

        game->setMousePos(sf::Mouse::getPosition(window).x,sf::Mouse::getPosition(window).y) ;

        if (window.hasFocus()) {
        if (!game->Frame(dt)) {
            window.close() ;
            break ;
        }
        if (game->isNewScript()) {
            if (prevgame!=nullptr) {
                game = prevgame ;
                prevgame = nullptr ;
            }
            else {
                script = game->getNewScript() ;
                args  = QGameSystem::ScriptValue2String(game->getNewScriptArgs()) ;
                game->UnInit() ;
                delete game ;
                game = createGame(script,mapviewer,minimap,extproc) ;
                if (!game->Init(args)) return 1 ;
            }
            // Убираем слишком большую дельту, вызванную инициализацией новой игры
            lasttime = clock.getElapsedTime().asSeconds() ;
        }
        if ((closehandled)&&(prevgame==nullptr)) {
            script = game->sys->getCloseHandlerScript() ;
            prevgame = game ;
            game = createGame(script,mapviewer,minimap,extproc) ;
            if (!game->Init("null")) return 1 ;
            // Убираем слишком большую дельту, вызванную инициализацией новой игры
            lasttime = clock.getElapsedTime().asSeconds() ;
        }
        }

        window.clear();
        game->Render(&window) ;
        window.display();

        if (onceTestFullScreenSwitch()) {
            window.close() ;
            game->UnInit() ;
            delete game ;
            goto lab_reset_fullscreen ;
        }
    }

    game->UnInit() ;
    delete game ;

    a.quit() ;
    return EXIT_SUCCESS ;
}
