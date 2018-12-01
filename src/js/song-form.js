{
    let view = {
        el: '#main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form action="" class="form">
                <div class="xxx">
                <div class="row">

                    <input name="name" type="text" value="__name__" placeholder="歌名">
                </div>
                <div class="row">

                    <input name="artist" value="__artist__" type="text" placeholder="歌手">
                </div>
                <div class="row">

                    <input  name="url" type="text" value="__url__" placeholder="外链">
                </div>
                <div class="row actions">
                    <button type="submit">提交</button>
                </div>
                </div>
            </form>
            
           
       
    `,
        render(data = {}) {
            let placeholders = ['name', 'url', 'artist', 'id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (!data.id) {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            } else {
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }
        },
        reset() {
            this.render({})
        }

    }

    let model = {
        data: {
            name: '', artist: '', url: '', id: ''
        },
        create(data) {
            // 声明类型
            var Music = AV.Object.extend('Music');
            // 新建对象
            var music = new Music();
            // 设置名称
            music.set('name', data.name)
            music.set('artist', data.artist)
            music.set('url', data.url)
            // 设置优先级
            return music.save().then((newMusic) => {
                let {id, attributes} = newMusic
                //this.data = data转用了深拷贝来保证不该原来内存里的东西
                Object.assign(this.data, {
                    id,
                    ...attributes
                })
            }, function (error) {
                console.error(error);
            });


        },
        update(data) {
            var music = AV.Object.createWithoutData('Music', this.data.id);
            // 修改属性
            music.set('name', data.name)
            music.set('artist', data.artist)
            music.set('url', data.url)
            // 保存到云端
            return music.save().then((response) => {
                Object.assign(this.data, data)
                return response
            })
        }


    }

    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()

            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {

                if (this.model.data.id) {
                    this.model.data = {
                        name: '', url: '', id: '', artist: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }


                this.view.render(this.model.data)
            })

        },
        musicSave() {
            let needs = 'name artist url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })

            this.model.create(data)
                .then(() => {
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)
                })


        },

        musicUpdate() {
            let needs = 'name artist url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })

            this.model.update(data)
                .then(() => {
                    
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                })

        },

        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()

                if (this.model.data.id) {
                    this.musicUpdate()

                } else {
                    this.musicSave()

                }


            })

        }


    }
    controller.init(view, model)
}