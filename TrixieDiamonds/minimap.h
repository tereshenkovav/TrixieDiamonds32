#ifndef MINIMAP_H
#define MINIMAP_H

#include <QObject>
#include <SFML/Graphics.hpp>

class MiniMap : public QObject
{
    Q_OBJECT
private:
    sf::RenderTarget * target ;
    QList<sf::Sprite> minimaps ;
    QList<sf::Texture> texs ;

public:
    explicit MiniMap(sf::RenderTarget * target, QObject *parent = nullptr);
    void preloadMiniMaps(int window_w, int window_h, float scale);

public slots:
    void renderMiniMap(int x, int y, int level, bool dark) ;

signals:

};

#endif // MINIMAP_H
