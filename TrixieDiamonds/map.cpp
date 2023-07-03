#include "map.h"

Map::Map()
{
}

void Map::setSize(int w, int h)
{
    this->w=w;
    this->h=h;
    for (int i=0; i<w; i++)
        for (int j=0; j<h; j++)
            map[i][j]=Sky ;
}

int Map::getWidth() const
{
    return w ;
}

int Map::getHeight() const
{
    return h ;
}

void Map::setTerr(int i, int j, Terrain t)
{
    map[i][j]=t ;
}

Terrain Map::getTerr(int i, int j) const
{
    if (i<0) return Sky ;
    if (i>=w) return Sky ;
    if (j<0) return Sky ;
    if (j>=h) return Sky ;
    return map[i][j] ;
}

bool Map::isMatAtLeft(int i, int j) const
{
    if (i<=0) return false ;
    return map[i-1][j]!=Sky ;
}

bool Map::isMatAtRight(int i, int j) const
{
    if (i>=w-1) return false ;
    return map[i+1][j]!=Sky ;
}

bool Map::isNeedGrassOver(int i, int j) const
{
    if (j==0) return false ;
    return (map[i][j-1]==Ground)||(map[i][j-1]==Sky) ;
}
