/* tech it js */

var $article = $("article");
var $mainContent = $("#main");
var $logo = $("#logo");
var $whichReddit = $("#which-reddit");

var $landingPageContainer = $("#landing-page-container");

//Nav and search variables
var $dropdownButton = $(".dropdown-button");
var $dropdownMenu = $(".dropdown-menu");
var $nav = $("nav");
var $navItems = $("nav ul ul li");
var $searchButton = $("#search a");
var $search = $("#search");
var $searchBox = $("#search-box");
var $redditValue = $("#reddit");
var $initialValue = $("#initial-value span");

//PopUp variables
var $popUp = $("#popUp");
var $closePopUp = $(".closePopUp");
var $popUpTitle = $("#popUp h1");
var $popUpContent = $("#popUp p");
var $popUpLink = $(".popUpAction");

//Handlebars Template variables
var source = $("#article-template").html();
var template = Handlebars.compile(source);

//On click of logo, show main view
$logo.click(function(){
  location.reload();
})

// function searchAll(){
//   $popUp.removeClass("hidden");
//   searchReddit();
//   // searchDigg();
//   // searchMashable();
// }

//Search functionality
$searchButton.click(function () {
  $search.toggleClass("active");
})

// $dropdownButton.hover(function () {
//   $dropdownMenu.addClass("open");
// });

// $dropdownButton.click(function(){
//   switch ($initialValue.text()) {
//     case 'Reddit':
//       searchReddit();
//       break;
//     case 'Digg':
//       searchDigg();
//       break;
//     case 'Mashable':
//       searchMashable();
//       break;
//   }
// })

// Keep track of what slection is made
$whichReddit.change(function(){
  var searchTerm = $(this).find('option:selected').attr('value');
  searchReddit(searchTerm);
  // Change heading text on selection
  // var selectedText = $(this).find('option:selected').text();
  // $landingPageContainer.html("<h2 class='landing-page'>" + selectedText + "</h2>");
});

function Article(options) {
  this.title = options.title;
  this.impressions = options.impressions;
  this.tag = options.tag;
  this.image = options.image;
  this.link = options.link;
  this.description = options.description;
}

// subreddit apis
// https://www.reddit.com/r/javascript.json
// https://www.reddit.com/r/css.json
// https://www.reddit.com/r/programming.json
// https://www.reddit.com/r/ruby.json
// https://www.reddit.com/r/learnprogramming.json
// https://www.reddit.com/r/web_design.json

// REDDIT Search
function searchReddit(queryTerm) {
  $mainContent.empty();
  var url = 'https://www.reddit.com/r/' + queryTerm + '.json';
  $.ajax({
    url: url,
    success: function(response){
        $popUp.addClass("hidden");
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
          $mainContent.append(template(article));
        }
        // On click of article title, display pop-up
        var $title = $(".article .articleContent h3");
        $title.click(changePopUp);
    },
    error: function () {
      alert("Can't load because of error.");
    }
  })
}


// Populate popup with article info
function changePopUp (e) {
  e.preventDefault();
  var $clickedTitle = $(e.target);
  var $selectedArticle = $clickedTitle.closest('.article');
  var titleText = $selectedArticle.find('.title').text();
  var contentText = $selectedArticle.find('.content').text();
  var storyLink = $selectedArticle.find('.story-link').attr("href");
  $popUpTitle.html(titleText);
  $popUpContent.html(contentText);
  $popUpLink.attr("href", storyLink);
  $popUp.removeClass("loader hidden");
}

// Close popup
$closePopUp.click(function(e) {
  e.preventDefault();
  $popUp.addClass("loader hidden");
})

//Search filter
$searchBox.keyup(function () {
    var valThis = this.value.toLowerCase(),
        valLength  = this.value.length;

    $("#main>article h3").each(function () {
        var text  = $(this).text(),
            textL = text.toLowerCase(),
            htmlR = text.substr(0, valLength) + text.substr(valLength);
            if (textL.indexOf(valThis) == 0) {
              $(this).html(htmlR).show()
            } else {$(this).parent().parent().parent().hide();}
            if (valThis === ""){
              $(this).parent().parent().parent().show();
            }
    })
})
