#include "extproc.h"
#include <QDebug>

ExtProc::ExtProc(sf::RenderWindow * renderwindow):QObject() {
    this->renderwindow = renderwindow ;
}

void ExtProc::assignToGame(Game *game)
{
    connect(game->sys,SIGNAL(writeMessage(QString)),this,SLOT(getMessage(QString))) ;
    connect(game->sys,SIGNAL(writePair(QString,QVariant)),this,SLOT(getPair(QString,QVariant))) ;
    connect(game,SIGNAL(sendLog(QString)),this,SLOT(getMessage(QString))) ;
    connect(game,SIGNAL(sendTitle(QString)),this,SLOT(setTitle(QString))) ;
    connect(game->sys,SIGNAL(showCursor(bool)),this,SLOT(switchCursor(bool))) ;
}

void ExtProc::getMessage(QString msg) {
    qDebug()<<msg ;
}

void ExtProc::getPair(QString name,QVariant value) {
    //qDebug()<<name<<value ;
}

void ExtProc::setTitle(QString caption) {
    QByteArray bb = caption.toUtf8();
    renderwindow->setTitle(sf::String::fromUtf8(bb.constBegin(),bb.constEnd())) ;
}

void ExtProc::switchCursor(bool visible) {
    renderwindow->setMouseCursorVisible(visible) ;
}
