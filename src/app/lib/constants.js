let c = {};

c.earthRadius = 6.371;
c.earthAtmoshpere = c.earthRadius + 0.050;

c.karmanLine = c.earthRadius + 0.100;

c.leoLower = c.earthRadius + 0.160;
c.leoUpper = c.earthRadius + 2;

c.meoLower = c.earthRadius + 2;
c.meoUpper = c.earthRadius + 25;

c.yellow = 0xffd700;
c.blue = 0x357edd;
c.white = 0xffffff;

module.exports = c;
