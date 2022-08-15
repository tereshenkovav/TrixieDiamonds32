#ifndef MAP_H
#define MAP_H

enum Terrain { Sky, Ground, Cave, Wall } ;

class Map
{
private:
    int w ;
    int h ;
    Terrain map[20][20] ;
public:
    Map() ;
    void setSize(int w, int h) ;
    int getWidth() const ;
    int getHeight() const ;
    void setTerr(int i, int j, Terrain t) ;
    Terrain getTerr(int i, int j) const ;
    bool isMatAtLeft(int i, int j) const ;
    bool isMatAtRight(int i, int j) const ;
    bool isNeedGrassOver(int i, int j) const ;
};

#endif // MAP_H
