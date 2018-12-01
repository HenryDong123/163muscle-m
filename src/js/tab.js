{
    let view = {
        el:'.tab',
        template:`
            <div class="logo">
                <span>DMX</span>
            </div>
            <div class="title">
               歌曲管理
            </div>
        `,

        render(){
            $(this.el).html(this.template)



        }

    }

    let model= {
        data: {
            name: '', artist: '', url: '', id: ''
        },



    }

    let controller ={
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()




        }

    }

    controller.init(view,model)
}