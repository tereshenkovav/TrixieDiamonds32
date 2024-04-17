#include "minimap.h"
#include "mapviewer.h"

MiniMap::MiniMap(sf::RenderTarget * target, QObject *parent) : QObject(parent)
{
    this->target = target ;
}

void MiniMap::renderMiniMap(int x, int y, int level, bool dark)
{
    minimaps[level].setPosition(x,y) ;
    if (dark) minimaps[level].setColor(sf::Color(64,64,64)) ;
    else minimaps[level].setColor(sf::Color::White) ;
    target->draw(minimaps[level]) ;
}

void MiniMap::preloadMiniMaps(int window_w, int window_h, float scale) {
    // Именно в таком порядке! Если создать меньшую текстуру после большей,
    // то нарушается работа clear()  Проверить на свежем SFML
    sf::RenderTexture texmini ;
    texmini.create(window_w*scale,window_h*scale) ;

    sf::RenderTexture texdraw ;
    texdraw.create(window_w,window_h) ;

    MapViewer mapviewer(&texdraw) ;
    for (int i=0; i<10; i++) {
        mapviewer.loadMapFromFile(QString("maps/map_%1.dat").arg(i)) ;

        texdraw.clear(sf::Color(105,146,255)) ;
        mapviewer.render() ;
        texdraw.display() ;

        sf::Sprite spr(texdraw.getTexture()) ;
        spr.setScale(scale,scale) ;
        texmini.clear() ;
        texmini.draw(spr) ;
        texmini.display() ;

        texs.append(sf::Texture(texmini.getTexture())) ;
        minimaps.append(sf::Sprite(texs[i])) ;
        minimaps[i].setOrigin(window_w*scale/2,window_h*scale/2) ;
    }
}
