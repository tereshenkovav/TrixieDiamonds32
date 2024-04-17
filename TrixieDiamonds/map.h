#ifndef MAP_H
#define MAP_H

enum Terrain { Sky, Ground, Cave, Wall } ;

const int MAPSIZE = 20 ;

class Map
{
private:
    int w ;
    int h ;
    Terrain map[MAPSIZE][MAPSIZE] ;
public:
    Map() ;
    void setSize(int w, int h) ;
    int getWidth() const ;
    int getHeight() const ;
    void clear() ;
    void setTerr(int i, int j, Terrain t) ;
    Terrain getTerr(int i, int j) const ;
    bool isMatAtLeft(int i, int j) const ;
    bool isMatAtRight(int i, int j) const ;
    bool isNeedGrassOver(int i, int j) const ;
};

#endif // MAP_H
