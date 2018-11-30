{
    let view = {
        el: '#songList-container',
        template: `
             <ul class="songList">
                
            </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let {music} = data
            let liList = music.map((music) => $('<li></li>').text(music.name))

            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })

        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }

    }

    let model = {
        data: {
            music: []

        },
        find() {
            var query = new AV.Query('Music');
            return query.find().then((music) => {
                this.data.music = music.map((music) => {
                    return {id: music.id, ...music.attributes}
                })
                return music
            })
        }


    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (musicData) => {
                this.model.data.music.push(musicData)
                this.view.render(this.model.data)
            })
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })


        }


    }
    controller.init(view, model)
}