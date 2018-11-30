{
    let APP_ID = 'bAbHkSnmDdvIAUFeG4veWnzJ-gzGzoHsz';
    let APP_KEY = 'WnO4bokOHPAWe7ozvuGSjnjm';

    AV.init({
        appId: APP_ID,
        appKey: APP_KEY
    });

    /*    var TestObject = AV.Object.extend('musicList');
        var testObject = new TestObject();
        testObject.save({
            name: 'test',
            cover: 'test',
            creatorId: 'test',
            description: 'test',
            musics:['1','2']
        }).then(function(object) {
            alert('LeanCloud Rocks!');
        })*/
}