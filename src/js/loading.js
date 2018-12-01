{
    let view = {
        el:'.loading-wrapper',
        template:`
             <div class="wrap">
        <div class="bg">
            <div class="loading">
                <span class="titleText">上传中....</span>
                <span class="text">٩꒰▽ ꒱۶⁼³₌₃请稍等!</span>
            </div>
        </div>
    </div>
        `,

        render(){
            $(this.el).html(this.template)
        },
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }

    }


    let controller = {
        init(){

            this.view = view
            this.view.render()
            this.bindEventHub()


        },
        bindEventHub(){
            window.eventHub.on('beforeUpload',()=>{
                this.view.show()
            })
            window.eventHub.on('afterUpload',()=>{
                this.view.hide()
            })
        }

    }

    controller.init(view)

}