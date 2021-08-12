export const readRefBurrito = async ({
    metaPath,
}) => {
    const fs = window.require('fs');
    const path = require('path');
    return new Promise((resolve) => {
        if (fs.existsSync(metaPath)) {
           const fileContent = fs.readFileSync(
                path.join(metaPath),
                'utf8',
              );
              resolve((fileContent));
        }
    });
};
