
export function getLocalPoster(title: string): any {
    const formatted = title.toLowerCase().replace(/[^a-z0-9]/gi, '');
  
    
  
    switch (formatted) {
      case 'duneparttwo':
        return require('../assets/images/posters/dune.jpg');
      case 'godzillaxkongthenewempire':
        return require('../assets/images/posters/godzilla-x-kong.jpg');
      case 'kingdomoftheplanetoftheapes':
        return require('../assets/images/posters/apes.jpg');
      case 'ghostbustersfrozenempire':
        return require('../assets/images/posters/ghostbusters.jpg');
      case 'thefallguy':
        return require('../assets/images/posters/fall-guy.jpg');
      case 'aquietplacedayone':
        return require('../assets/images/posters/quiet-place.jpg');
      case 'insideout2':
        return require('../assets/images/posters/inside-out-2.jpg');
        case 'furiosaamadmaxsaga':
        return require('../assets/images/posters/furiosa.jpg');
      case 'deadpoolwolverine':
        return require('../assets/images/posters/deadpool.jpg');
      case 'badboysrideordie':
        return require('../assets/images/posters/bad-boys.jpg');
      case 'thegarfieldmovie':
        return require('../assets/images/posters/garfield.jpg');
      case 'oppenheimer':
        return require('../assets/images/posters/oppenheimer.jpg');
      default:
        return require('../assets/images/posters/placeholder.jpg');
    }
  }
  