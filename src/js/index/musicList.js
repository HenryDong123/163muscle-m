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
            let {music, selectMusicId} = data
            let liList = music.map((music) => {
                let $li = $('<li></li>').text(music.name).attr('music-id', music.id)
                if (music.id === selectMusicId){
                    $li.addClass('active')

                }

                return $li

            })

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
            music: [],
            selectMusicId: null,

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


            window.eventHub.on('update', (Music) => {

                let music = this.model.data.music


                for (let i = 0; i < music.length; i++) {
                    if (music[i].id === Music.id) {
                        Object.assign(music[i], Music)
                    }

                }
                this.view.render(this.model.data)

            })

            window.eventHub.on('delete',(Music) =>{
                console.log(Music)

                let music = this.model.data.music
                for (let i = 0; i < music.length; i++) {
                    if (music[i].id === Music.id) {
                        this.getALlMusic()
                    }

                }

            })


        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {

                let musicId = e.currentTarget.getAttribute('music-id')

                this.model.data.selectMusicId = musicId
                this.view.render(this.model.data)

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