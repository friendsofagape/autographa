Parse.Cloud.define('deleteUserfile', async (request) => {
    const { fileId } = request.params;
    const Files = Parse.Object.extend('Files');
    const query = new Parse.Query(Files);
    try {
        const file = await query.get(fileId);
        const fileobj = file.get('picture');
        await fileobj.destroy({ useMasterKey: true });
        await file.destroy();
        return 'file removed.';
    } catch (error) {
        console.log(error);
        throw new Error('Error deleting file');
    }
});
