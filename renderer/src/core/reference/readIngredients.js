export const readIngredients = async ({
    filePath,
}) => {
    const fs = window.require('fs');
    const path = require('path');
    return new Promise((resolve) => {
        if (fs.existsSync(filePath)) {
           const fileContent = fs.readFileSync(
                path.join(filePath),
                'utf8',
              );
              resolve((fileContent));
        }
    });
};
