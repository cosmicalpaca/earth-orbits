let c = {};

c.earthRadius = 6371;
c.earthAtmoshpere = c.earthRadius + 50;

c.karmanLine = c.earthRadius + 100;

c.leoLower = c.earthRadius + 160;
c.leoUpper = c.earthRadius + 2000;

c.meoLower = c.earthRadius + 2000;
c.meoUpper = c.earthRadius + 25000;

c.yellow = 0xffd700;
c.blue = 0x357edd;
c.white = 0xffffff;

c.issAltitude = c.earthRadius + 400;

module.exports = c;
