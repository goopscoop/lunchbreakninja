router.post('/result', function(req,res){
  ///////////FUNCTIONS////////////

  //pick random num based on length of array
  var randomNum = function(array){
     return Math.floor(Math.random() * (array.length));
  }


  var closeApiAsync = function(place,distanceRadios,offsetCounter){
    var count = 0;
    var loops = 0;
    var distance = true;
    var returnedData = true;
    async.whilst(
    function () { return distance && returnedData && loops < 2},
    function (callback) {
        yelp.search({term: 'restaurants', location: place, sort: 1, offset: count},
          function(error, data) {
            if( error ) console.log(error);
            console.log('STARTING FOR LOOP WITHIN CLOSELIST')
            if (data) {
              for(var i = 0; i < data.businesses.length; i ++) {
                if ( data.businesses[i].distance < parseInt(distanceRadios) ) {
                  closeBusinesses.push(data.businesses[i]);
                  console.log(data.businesses[i].distance, parseInt(distanceRadios));
                } else {
                  distance = false;
                  return;
                }
              }
            } else {
              returnedData = false;
            }
        })
        count += 20;
        loops++;
        setTimeout(callback, 1000);
    },
    function (err) {
        // 5 seconds have passed
      console.log('ASYNC ERROR',err);
      if (req.user) {
          var myCats = narrowCatsUser(closeBusinesses);
        } else {
          var myCats = narrowCats();
          var narrowedList = matchList(closeBusinesses, myCats);
          var finalPick = getPick(narrowedList);
        }
    })
  }



  // var closeApi = function(place,distanceRadios,offsetCounter) {
  //   console.log('IF LESS THAN 900 METERS')
  //   yelp.search({term: 'restaurants', location: place, sort: 1, offset: offsetCounter},
  //    function(error, data) {
  //     if( error ) console.log(error);
  //     console.log('STARTING FOR LOOP WITHIN CLOSELIST')
  //     for(var i = 0; i < data.businesses.length; i ++) {
  //       if ( data.businesses[i].distance < distanceRadios ) {
  //         closeBusinesses.push(data.businesses[i]);
  //       } else {
  //         return;
  //       }
  //     }
  //     // if ( data.businesses.length &&
  //     //     data.businesses[(data.businesses.length-1)].distance < distanceRadios ) {
  //     //   offsetCounter += 20;
  //     //   console.log('API LOOP', data.businesses.length)
  //     //   console.log(data.businesses[(data.businesses.length-1)].distance,
  //     //     distanceRadios)
  //     //   closeList(place, distanceRadios, offsetCounter)
  //     // }
  //      ////////////// PROCESSES CNT'D /////////////
  //     if (req.user) {
  //       var myCats = narrowCatsUser(closeBusinesses);
  //     } else {
  //       var myCats = narrowCats();
  //       var narrowedList = matchList(closeBusinesses, myCats);
  //       var finalPick = getPick(narrowedList);
  //     }
  //   });
  // }

  // var farApi = function(place,distanceRadios,offsetCounter) {
  //   console.log('IF GREATER THAN 900 METERS')
  //   yelp.search({term: 'restaurants', location: place, sort: 2, offset: offsetCounter},
  //    function(error, data) {
  //     if( error ) console.log(error);
  //     console.log('STARTING FOR LOOP WITHIN CLOSELIST')
  //     for(var i = 0; i < data.businesses.length; i ++) {
  //       if ( data.businesses[i].distance < distanceRadios ) {
  //         closeBusinesses.push(data.businesses[i]);
  //       } else {
  //         break;
  //       }
  //     }
  //     // if ( data.businesses.length &&
  //     //     data.businesses[(data.businesses.length-1)].distance < distanceRadios ) {
  //     //   offsetCounter += 20;
  //     //   console.log('API LOOP', data.businesses.length)
  //     //   console.log(data.businesses[(data.businesses.length-1)].distance, distanceRadios)
  //     //   closeList(place, distanceRadios, offsetCounter)
  //     // }
  //      ////////////// PROCESSES CNT'D /////////////
  //     if (req.user) {
  //        var myCats = narrowCatsUser(closeBusinesses);
  //     } else {
  //       var myCats = narrowCats();
  //       var narrowedList = matchList(closeBusinesses, myCats);
  //       var finalPick = getPick(narrowedList);
  //     }
  //   });
  // }

  var offsetCounter = 0;
  var closeBusinesses = [];
  //

  var closeList = function(place, distanceRadios, offsetCounter) {
    // var randomCat = array[randomNum(array)]

    // if( distanceRadios < 900 ) {
      closeApiAsync(place,distanceRadios,offsetCounter);
    // } else {
    //   farApi(place,distanceRadios,offsetCounter);
    // }
    if( closeBusinesses.length > 0 ) {
      console.log(closeBusinesses.length)
    };
  }


  //Returns an array of all user categories, if user not logged in,
  //automatically fill in all categories
  var narrowCats = function() {
    console.log('IN ELSE OF NARROWCATS')
    var catSearch = [ 'pubs','sushi','pizza','thai','seafood','mexican',
                      'chinese','vietnamese','italian','greek','indpak',
                      'ramen','korean','japanese','burgers','sandwiches',
                      'bbq' ];
                      // res.send(catSearch)
        return catSearch;
  }

  var narrowCatsUser = function(closeBusinesses) {
    var catSearch = [];
      console.log("IN USER VERSION OF NARROWCATS")
        db.user.find({where: {id: req.user.id }, include: [db.category] })
          .then(function(data){
            // res.send(data)
            console.log('CATEGORYS PICKED');
            for(var i = 0; i < data.categories.length; i ++){
              catSearch.push(data.categories[i].category)
              console.log('cat', i, data.categories[i].category)
            }
            var narrowedList = matchList(closeBusinesses, catSearch);
            var finalPick = getPick(narrowedList);
          })
  }


  //removes all restaurants that don't match user prefrences
  var matchList = function(fullList, myCats){
    console.log('STARTING MATCHLIST')
    // console.log(fullList)
    var narrowList = [];
    fullList.forEach(function(val, loc){
      for(var i = 0; i < myCats.length; i++ ){
        if(fullList[loc].categories[0][0] === myCats[i] ||
           fullList[loc].categories[0][1] === myCats[i] ||
           fullList[loc].categories[0][2] === myCats[i]
          ){
          console.log('if',myCats[i])
          narrowList.push(fullList[loc]);
          break;
        }
        // console.log(myCats[i])
      }
    })
    if (narrowList.length < 1 ){
      console.log('IN FIRST IF OF MATCHLIST')
      req.flash('danger','There are no restaurants within your search range that match your prefrences. Please either expand your search radius or add more kinds of restaurants to your prefrences, then try again');
      // res.send(narrowList)
      res.redirect('ninjitsu')
    } else if ( narrowList.length === 1 ) {
      console.log('IN SECOND IF OF MATCHLIST')
      req.flash('danger','There was only one restaurant within your search range that match your prefrences. For better results in the future, please either expand your search radius or add more kinds of restaurants to your prefrences, then try again');
      res.render('ninjitsu/result', { finalPick: narrowList[0] })
    } else if ( narrowList.length < 4 ) {
      console.log('IN THIRD IF OF MATCHLIST')
      req.flash('warning','There is a limited number of restaurants within your search range that match your prefrences. For better results in the future, please either expand your search radius or add more kinds of restaurants to your prefrences, then try again');
    }
    console.log('MATCHLIST SUCCESS')
    // console.log('MATCHLIST RESULT:', narrowList)
    return narrowList;
  }

  //returns the final pick which considers high ratings first
  var getPick = function(narrowedList){
    var finalNarrow = [];
    console.log('STARTING GETPICK')
    //sorts all restaurants by rating with 4.5 and up
    //at the beginning of the array, and 4.0 at the end.
    for(var i = 0; i < narrowedList.length; i++) {
      if( narrowedList[i].rating > 4 ) {
        finalNarrow.unshift(narrowedList[i])
      } else if ( narrowedList[i].rating > 3.5 ) {
        finalNarrow.push(narrowedList[i])
      }
    }

    //If the above function returns an array of 3 or less
    //the below function then adds restaurants with a score
    //of 3.5.
    if( finalNarrow.length < 6 ) {
      console.log('IN IF OF GET PICK, LOW RATINGS')
      req.flash('warning','There is a limited number of restaurants with high yelp ratings in your search range that match your prefrences. We\'ve expanded your results to include restaurants with a 3.5 rating or above. For even better results in the future, consider either expanding your search radius or add more kinds of restaurants to your prefrences, then try again. :)');
      for( var j = 0; j < narrowedList.length; j++ ) {
        if ( narrowedList[j].rating < 4 && narrowedList[j].rating > 3 )
          finalNarrow.push(data.businesses[i]);
      }
    }
    console.log('END OF MATCHLIST')
    console.log('TOTAL RESULTS:', finalNarrow.length)
    // console.log('RESULT:', finalPick)
    var finalPick = []
    finalPick.push(finalNarrow[randomNum(finalNarrow)])
    res.render('ninjitsu/result', {'finalPick': finalPick, location: req.body.location, distanceRadios: req.body.distanceRadios});
  };

 ///////////////PROCESSING START///////////////
  closeList(req.body.location, req.body.distanceRadios, 0);


});