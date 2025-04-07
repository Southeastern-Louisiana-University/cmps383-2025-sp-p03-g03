
const posters: { [key: string]: any } = {
  "dune: part two": require("../assets/images/posters/dune.jpg"),
  "godzilla x kong: the new empire": require("../assets/images/posters/godzilla-x-kong.jpg"),
  "kingdom of the planet of the apes": require("../assets/images/posters/apes.jpg"),
  "ghostbusters: frozen empire": require("../assets/images/posters/ghostbusters.jpg"),
  "the fall guy": require("../assets/images/posters/fall-guy.jpg"),
  "a quiet place: day one": require("../assets/images/posters/quiet-place.jpg"),
  "inside out 2": require("../assets/images/posters/inside-out-2.jpg"),
  "furiosa: a mad max saga": require("../assets/images/posters/furiosa.jpg"),
  "deadpool & wolverine": require("../assets/images/posters/deadpool.jpg"),
  "bad boys: ride or die": require("../assets/images/posters/bad-boys.jpg"),
  "the garfield movie": require("../assets/images/posters/garfield.jpg"),
  "oppenheimer": require("../assets/images/posters/oppenheimer.jpg"),
};

export function getLocalPoster(title: string): any {
  const key = title?.trim().toLowerCase();
  const poster = posters[key];

  if (!poster) {
   
    return require("../assets/images/posters/placeholder.jpg");
  }

  return poster;
}
