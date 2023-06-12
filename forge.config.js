module.exports = {
    packagerConfig: {
        icon: __dirname + "/src/public/icon2"
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            platforms: ['win32'],
            config: {
                name: "GtaDerzhava",
                authors: "GTA DERZHAVA",
                setupIcon: __dirname + "/src/public/icon2.ico",
                iconUrl: __dirname + "/src/public/icon2.ico"
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
};
