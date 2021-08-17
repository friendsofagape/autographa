export const readIngredients = async ({
    filePath,
}) => {
    const fs = window.require('fs');
    const path = require('path');
    return new Promise((resolve) => {
        console.log(filePath, fs.existsSync(filePath));
        if (fs.existsSync(filePath)) {
           const fileContent = fs.readFileSync(
                path.join(filePath),
                'utf8',
              );
              resolve((fileContent));
        }
    });
};
