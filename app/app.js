// Define out app instance
App = new Backbone.Marionette.Application();

// Add the app main region – this is where we show our layout view
App.addRegions({
    mainRegion: '.main-region'
});

// Define our app layout view
LayoutView = Marionette.LayoutView.extend({
    template: "#layout-view-template",

    // Here we specify 2 regions that we will show our form and posts views in
    regions: {
        formRegion: '.form-region',
        postsRegion: '.posts-region'
    },

    // Called when the layut view is initialized
    initialize: function(options){

        // we store this here so we have the correct 'this' in scope during
        // on 'form:submit'
        var self = this;

        this.blogPostsView = new BlogPostsView({
            collection: options.posts
        });

        this.formView = new FormView();

        // Here we listen to form:submit on our form view...
        this.formView.on("form:submit", function(data) {

            // Create a new post using the (prepared) form data
            var post = new Backbone.Model(data);

            // Get our posts collection
            var posts = self.blogPostsView.options.collection;

            // Add the new post to the collection
            posts.unshift(post);

            // Once we have the new post, clear the form
            self.formView.resetForm();
        });
    },

    // Called when we show the layout view inside the main app region
    onShow: function(){
        // We show our views in the desirend regions
        this.postsRegion.show(this.blogPostsView);
        this.formRegion.show(this.formView);
    }
});

// Our single blog post model
BlogPost = Backbone.Model.extend();

// Our collection of blog posts
BlogPosts = Backbone.Collection.extend({
    model: BlogPost
});

// Our single blog post view
BlogPostView = Backbone.Marionette.ItemView.extend({
    // uses #blog-post-template (inside index.html)
    template: "#blog-post-template",
    tagName: 'li',
    className: 'blog__post'
});

BlogPostsView = Backbone.Marionette.CollectionView.extend({
    // uses #blog-posts-template (inside index.html)
    template: "#blog-posts-template",
    tagName: "ul",
    className: "blog",
    // Here we specify that children of this view are instances of BlogPostView
    childView: BlogPostView
});

FormView = Marionette.ItemView.extend({

    template: '#form-template',

    // Here we call formSubmit on .submit click events
    events: {
        'click .submit': 'formSubmit'
    },

    onShow: function(){
        // Get a reference to our form
        this.form = this.$el.find('#form');
    },

    // When the form is submitted, we grab the data and trigger form:submit,
    // passing along the data
    formSubmit: function(e) {
        e.preventDefault();
        var data = this.getFormData(this.form);
        this.trigger("form:submit", data);
    },

    // Serialize the form data
    getFormData: function(form) {
        var title = form.find('input[name="title"]').val();
        var content = form.find('input[name="content"]').val();
        // Create a post object that will be used to initialize a new post model
        var post = {
            title: title || 'Untiled post',
            content: content || 'This post has no content',
            date: new Date()
        };
        return post;
    },  

    resetForm: function(){
        this.form.find('input[name="title"]').val('');
        this.form.find('input[name="content"]').val('');
    }
});

// Add an initializer (called when we instanciate our app)
App.addInitializer(function(options){
    // Options passed in when we call app start
    // Create our new layout view and show it in app.mainRegion
    // Triggers 'onShow' in layout view)
    var layoutView = new LayoutView(options);
    this.mainRegion.show(layoutView);
});

$(document).ready(function(){

    // Initialize our posts collection, passing in an array of posts
    var posts = new BlogPosts([
        new BlogPost({ 
            title: 'A new post', 
            content: 'This is my post',
            date: 'Fri Apr 03 2015 13:55:44 GMT+0100 (BST)'
        }),
        new BlogPost({ 
            title: 'Another new post', 
            content: 'Another post',
            date: 'Fri Apr 03 2015 13:12:45 GMT+0100 (BST)'
        }),
        new BlogPost({ 
            title: 'Hello world', 
            content: 'This is my hello world post',
            date: 'Fri Apr 03 2015 13:11:12 GMT+0100 (BST)'
        })
    ]);

    // Start the app, passing in posts using an options hash
    App.start({posts: posts});
});