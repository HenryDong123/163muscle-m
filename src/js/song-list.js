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
            let liList = music.map((music) => $('<li></li>').text(music.name).attr('music-id', music.id))

            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })

        },

        activeItem(li) {
            let $li = $(li)
            $li.addClass('active')
                .siblings('.active').removeClass('active')
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
            this.bindEvents()
            this.bindEventHub()
            this.getALlMusic()


        },

        getALlMusic() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },

        bindEventHub() {

            window.eventHub.on('create', (musicData) => {
                this.model.data.music.push(musicData)
                this.view.render(this.model.data)
            })


            window.eventHub.on('new', () => {
                this.view.clearActive()

            })


        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
                let musicId = e.currentTarget.getAttribute('music-id')
                let data
                let music = this.model.data.music
                for (let i = 0; i < music.length; i++) {

                    if (music[i].id === musicId) {
                        data = music[i]
                        break
                    }

                }

                let copy = JSON.stringify(data)
                let newData = JSON.parse(copy)
                window.eventHub.emit('select', newData)
                //防止改动内存后造成的bug，使用深拷贝

            })

        }


    }
    controller.init(view, model)
}