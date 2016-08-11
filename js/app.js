/* tech it js */
var $mainContent = $("#main");
var $logo = $("#logo");
var $whichReddit = $("#which-reddit");
var $landingPageContainer = $("#landing-page-container");
var placeholderImages = ["images/placeholder/chess.jpg", "images/placeholder/ducky.jpg", "images/placeholder/hand-with-watch.jpg", "images/placeholder/headphones-2.jpg", "images/placeholder/headphones-3.jpg", "images/placeholder/headphones.jpg", "images/placeholder/iphone.jpg", "images/placeholder/keyboard-phone.jpg", "images/placeholder/lego.jpg", "images/placeholder/mac.jpg", "images/placeholder/mobile-devices.jpg", "images/placeholder/more-typing.jpg", "images/placeholder/phone-2.jpg", "images/placeholder/phone.jpg", "images/placeholder/typing.jpg", "images/placeholder/watch.jpg"];

//Nav and search variables
var $searchButton = $("#search a");
var $search = $("#search");
var $searchBox = $("#search-box");

//Handlebars Template variables
var source = $("#article-template").html();
var template = Handlebars.compile(source);

function sample(array) {
  return array[Math.floor ( Math.random() * array.length )]
}

//On click of logo, show main view
$logo.click(function(){
  location.reload();
})

//Search functionality
$searchButton.click(function () {
  $search.toggleClass("active");
})

// Keep track of what slection is made
$whichReddit.change(function(){
  var searchTerm = $(this).find('option:selected').attr('value');
  searchReddit(searchTerm);
  // Change heading text on selection
  var selectedText = $(this).find('option:selected').text();
  $landingPageContainer.html("<h2 class='landing-page'>" + selectedText + "</h2>");
});

// constructor for populating reddit search results
function Article(options) {
  this.title = options.title;
  this.impressions = options.impressions;
  this.tag = options.tag;
  this.image = options.image;
  this.link = options.link;
  this.description = options.description;
}

// REDDIT Search
function searchReddit(queryTerm) {
  $mainContent.empty();
  var url = 'https://www.reddit.com/r/' + queryTerm + '.json';
  $.ajax({
    url: url,
    success: function(response){
        var articleData = response.data.children
        for (i = 0; i < articleData.length; i++) {
          var article = new Article({
            title: articleData[i].data.title,
            impressions: articleData[i].data.score,
            tag: articleData[i].data.subreddit,
            image: articleData[i].data.thumbnail,
            link: articleData[i].data.url,
            description: " "
          });
          if (article.image == "self" || article.image == "default" || article.image == "") {
            article.image = sample(placeholderImages);
          }
          $mainContent.append(template(article));
        }
    },
    error: function () {
      $landingPageContainer.html("<h3 class='landing-page'>Oh nos! Couldn't load because of an error.</h3>");
    }
  })
}

//Search filter
$searchBox.keyup(function () {
    var valThis = this.value.toLowerCase(),
        valLength  = this.value.length;
    $("#main>article h3").each(function () {
        var text  = $(this).text(),
            textL = text.toLowerCase(),
            htmlR = text.substr(0, valLength) + text.substr(valLength);
            if (textL.indexOf(valThis) == 0) {
              $(this).html(htmlR).show();
            } else {
              $(this).closest("article").hide();
            }
            if (valThis === ""){
              $(this).closest("article").show();
            }
    })
})
