#ifndef MAPVIEWER_H
#define MAPVIEWER_H

#include <QObject>
#include <SFML/Graphics.hpp>
#include "map.h"
#include <QMap>
#include <QtScript/QScriptEngine>
#include <QPoint>

struct SpawnPoint {
    int x ;
    int y ;
    int wleft ;
    int wright ;
};

class MapViewer : public QObject
{
    Q_OBJECT

private:
    sf::RenderTarget * target ;
    Map map ;

    sf::Sprite gnd_mid;
    sf::Sprite gnd_right;
    sf::Sprite gnd_left;
    sf::Sprite caveback;
    sf::Sprite gnd_stone;
    sf::Texture tex1 ;
    sf::Texture tex2 ;
    sf::Texture tex3 ;
    sf::Texture tex4 ;
    sf::Texture tex5 ;
    int blockw ;
    int blockh ;
    int edgew ;
    int caveh ;
    QMap<QChar,Terrain> terrdict ;
    QScriptEngine * engine ;
    QList<SpawnPoint> spawns ;

    const int LEFT=0 ;
    const int TOP=40 ;

    void renderSprite(sf::Sprite & spr, int x, int y) ;
    bool isSkyAndCave(Terrain t1, Terrain t2) const ;

public:
    explicit MapViewer(sf::RenderTarget * target, QObject *parent = nullptr);
    void setEngine(QScriptEngine * engine) ;

public slots:
    void render() ;
    void loadMapFromFile(const QString & mapfile) ;
    int getPlateCount() ;
    int getPlateY(int i) ;
    bool isNeedStop(double x1, double x2, int platei, double w2, bool isfly) ;
    bool canJumpTo(double x, int targetplatei, int playerw) ;
    QScriptValue genSpawnPoint(double playerx, int playerplatei) ;
};

#endif // MAPVIEWER_H
