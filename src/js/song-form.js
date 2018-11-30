{
    let view = {
        el: '.page > main',
        init(){
          this.$el = $(this.el)
        },
        template: `
            <h1>新建歌曲</h1>
            <form action="" class="form">
                <div class="row">
                    <label>
                        歌名
                    </label>
                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label>
                        歌手
                    </label>
                    <input name="artist" value="__artist__" type="text" >
                </div>
                <div class="row">
                    <label>
                        外链
                    </label>
                    <input  name="url" type="text" value="__url__">
                </div>
                <div class="row actions">
                   <button type="submit">提交</button>
                </div>
            </form>
    `,
        render(data = {}){
            let placeholders= ['name','url', 'artist', 'id']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }

    }

    let model = {
        data: {
          name: '', artist: '', url: '', id: ''
        },
        create(data){
            // 声明类型
            var Music = AV.Object.extend('Music');
            // 新建对象
            var music = new Music();
            // 设置名称
            music.set('name',data.name);
            music.set('artist',data.artist);
            music.set('url',data.url);
            // 设置优先级
            return music.save().then((newMusic)=>{
                let {id, attributes} = newMusic
                //this.data = data转用了深拷贝来保证不该原来内存里的东西
                Object.assign(this.data, {
                    id,
                    ...attributes
                })
            }, function (error) {
                console.error(error);
            });

        }

    }

    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload',(data) =>{
                this.view.render(data)
            })
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })

        },

        bindEvents(){
            this.view.$el.on('submit', 'form',(e)=>{
                e.preventDefault()
                let needs = 'name artist url'.split(' ')
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })

                this.model.create(data)
                    .then(()=>{
                        this.view.reset()
                        let string= JSON.stringify(this.model.data)
                        let object = JSON.parse(string)
                        window.eventHub.emit('create',object)
                    })



            })

        }





    }
    controller.init(view,model)
}