Template.navbar.helpers({
  profileImageUrl: function() {
    // get a object with profile image url
    var profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  },
  "isSearchRoute": function () {
    // Get name of current route from Router
    var routeName = Router.current().route.getName();

    if (routeName === "search") {
      return true;
    } else {
      return false;
    }
  }
});

Template.navbar.events({
  'submit #header-search-form': function (event, template) {
    // Prevent page from refreshing
    event.preventDefault();

    // Get current search value from the header search field
    var searchValue = $('#header-search-text').val();

    // Redirect user to search page, provide search value as a query parameter e.g. "/search?q=searchValue"
    Router.go('search', {}, {query: 'q='+searchValue});

    // Reset value of search bar
    $('#header-search-text').val("");
  }
});
