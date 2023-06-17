#include "mapviewer.h"
#include <QFile>
#include <QMap>
#include "pcxtexloader.h"
#include <QRandomGenerator>

void pcx2sfTexture(sf::Texture * tex, const QString & filename, bool usetransp=true) {
    PcxTexLoader loader ;
    if (loader.loadFile(filename,usetransp)) {
        tex->create(loader.getWidth(),loader.getHeight()) ;
        tex->update(loader.getData()) ;
    }
}

MapViewer::MapViewer(sf::RenderTarget * target, QObject *parent) : QObject(parent)
{
    this->target = target ;

    pcx2sfTexture(&tex1,"gnd_mid.pcx") ;
    gnd_mid.setTexture(tex1) ;
    blockw = tex1.getSize().x ;
    blockh = tex1.getSize().y-5 ;

    pcx2sfTexture(&tex2,"gnd_left.pcx") ;
    gnd_left.setTexture(tex2) ;
    edgew = tex2.getSize().x ;

    pcx2sfTexture(&tex3,"gnd_rght.pcx") ;
    gnd_right.setTexture(tex3) ;

    pcx2sfTexture(&tex4,"caveback.pcx",false) ;
    caveback.setTexture(tex4) ;
    caveh=tex4.getSize().y ;

    pcx2sfTexture(&tex5,"gnd_ston.pcx") ;
    gnd_stone.setTexture(tex5) ;

    terrdict.insert('G',Ground) ;
    terrdict.insert('C',Cave) ;
    terrdict.insert('W',Wall) ;
}

void MapViewer::setEngine(QScriptEngine *engine)
{
    this->engine = engine ;
}

void MapViewer::renderSprite(sf::Sprite & spr, int x, int y) {
    spr.setPosition(x,y) ;    
    target->draw(spr) ;

    /*
    sf::VertexArray line;
    line.setPrimitiveType(sf::Lines) ;
    line.resize(2);
    line[0].color = sf::Color::White;
    line[1].color = sf::Color::White;
    line[0].position = sf::Vector2f(x,0);
    line[1].position = sf::Vector2f(x,600);
    target->draw(line) ;
    */
}

bool MapViewer::isSkyAndCave(Terrain t1, Terrain t2) const
{
    if ((t1==Terrain::Sky)&&(t2==Terrain::Cave)) return true ;
    if ((t1==Terrain::Cave)&&(t2==Terrain::Sky)) return true ;
    return false ;
}

void MapViewer::render()
{
    for (int j=0; j<map.getHeight(); j++)
        for (int i=0; i<map.getWidth(); i++) {
            if (map.getTerr(i,j)==Sky) {
                if (map.isMatAtLeft(i,j)) renderSprite(gnd_right,LEFT+blockw*i,TOP+j*blockh) ;
                if (map.isMatAtRight(i,j)) renderSprite(gnd_left,LEFT+blockw*i+blockw-edgew,TOP+j*blockh) ;
            }
            if (map.getTerr(i,j)==Ground)
                renderSprite(gnd_mid,LEFT+blockw*i,TOP+j*blockh) ;
            if (map.getTerr(i,j)==Cave) {
                if (map.isNeedGrassOver(i,j))
                    renderSprite(gnd_mid,LEFT+blockw*i,TOP+j*blockh) ;
                for (int k=1; k<=6; k++)
                    renderSprite(caveback,LEFT+blockw*i,TOP+j*blockh+caveh*k) ;
                renderSprite(gnd_stone,LEFT+blockw*i,TOP+j*blockh+blockh) ;
            }
            if (map.getTerr(i,j)==Wall) {
                renderSprite(gnd_mid,LEFT+blockw*i,TOP+j*blockh) ;
                if (!map.isNeedGrassOver(i,j))
                    renderSprite(gnd_stone,LEFT+blockw*i,TOP+j*blockh) ;
                renderSprite(gnd_stone,LEFT+blockw*i,TOP+j*blockh+blockh) ;
            }
        }
}

void MapViewer::loadMapFromFile(const QString &mapfile)
{
    QFile file(mapfile);
    if (!((file.exists())&&(file.open(QIODevice::ReadOnly)))) return ;

    int w = file.readLine().toInt() ;
    int h = file.readLine().toInt() ;
    map.setSize(w,h) ;

    for (int j=0; j<map.getHeight(); j++) {
        QString line = file.readLine() ;
        for (int i=0; i<line.length(); i++)
            if (terrdict.contains(line[i])) map.setTerr(i,j,terrdict[line[i]]) ;
    }
    file.close() ;

    spawns.clear() ;
    for (int i=0; i<map.getWidth(); i++)
        for (int j=0; j<map.getHeight(); j++) {
            bool z = true ;
            if (map.getTerr(i,j)==Terrain::Wall) z=false ;
            if (j<map.getWidth()-1)
                if (map.getTerr(i,j+1)==Terrain::Sky) z=false ;
            if (z) spawns.append(QPoint(LEFT+blockw*i+blockw/2,j)) ;
        }
}

int MapViewer::getPlateCount()
{
    return map.getHeight() ;
}

int MapViewer::getPlateY(int i)
{
    return TOP+i*blockh+blockh+caveh ;
}

bool MapViewer::isNeedStop(double x1, double x2, int platei, double w2, bool isfly)
{
    // Заглушка
    if ((x2<=w2)&&(x1>=w2)) return true ;
    if ((x1<=800-w2)&&(x2>=800-w2)) return true ;

    // Стоп над краем обрыва
    if (!isfly)
    if (platei<map.getHeight()-1)
        for (int i=0; i<map.getWidth(); i++) {
            if (x2>x1) {
                if (!map.isMatAtRight(i,platei+1))
                    if ((x1<=LEFT+blockw*(i+1))&&(x2>=LEFT+blockw*(i+1))) return true ;
            }
            else {
                if (!map.isMatAtLeft(i,platei+1))
                    if ((x2<=LEFT+blockw*(i))&&(x1>=LEFT+blockw*(i))) return true ;
            }
        }

    // В стену уперлись
    for (int i=1; i<map.getWidth(); i++) {
        if (x2>x1) {
            if ((x1+w2<=LEFT+blockw*(i))&&(x2+w2>=LEFT+blockw*(i))) {
                if (map.getTerr(i,platei)==Terrain::Wall) return true ;
                if (isSkyAndCave(map.getTerr(i,platei),map.getTerr(i-1,platei))) return true ;
            }
        }
        else {
            if ((x2-w2<=LEFT+blockw*(i+1))&&(x1-w2>=LEFT+blockw*(i+1))) {
                if (map.getTerr(i,platei)==Terrain::Wall) return true ;
                if (isSkyAndCave(map.getTerr(i,platei),map.getTerr(i+1,platei))) return true ;
            }
        }
    }

    return false ;
}

bool MapViewer::canJumpTo(double x, int targetplatei)
{    
    if (targetplatei<0) return false ;
    if (targetplatei>=map.getHeight()) return false ;
    bool isvalidplace = false ;
    foreach (auto sp, spawns)
        if (sp.y()==targetplatei)
            if (abs(sp.x()-x)<blockw/2) isvalidplace=true ;
    return isvalidplace ;
}

QScriptValue MapViewer::genSpawnPoint(double playerx, int playerplatei)
{    
    QScriptValue res = engine->newObject() ;
    while (true) {
        int idx = QRandomGenerator::system()->bounded(spawns.count()) ;
        if (!((playerplatei==spawns[idx].y())&&(abs(spawns[idx].x()-playerx)<2*blockw))) {
            res.setProperty("x",spawns[idx].x());
            res.setProperty("y",spawns[idx].y());
            return res ;
        }
    }
}
