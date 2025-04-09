import apes from "../assets/images/posters/apes.jpg";
import badBoys from "../assets/images/posters/bad-boys.jpg";
import deadpool from "../assets/images/posters/deadpool.jpg";
import dune from "../assets/images/posters/dune.jpg";
import fallGuy from "../assets/images/posters/fall-guy.jpg";
import furiosa from "../assets/images/posters/furiosa.jpg";
import garfield from "../assets/images/posters/garfield.jpg";
import ghostbusters from "../assets/images/posters/ghostbusters.jpg";
import godzilla from "../assets/images/posters/godzilla-x-kong.jpg";
import insideOut2 from "../assets/images/posters/inside-out-2.jpg";
import oppenheimer from "../assets/images/posters/oppenheimer.jpg";
import placeholder from "../assets/images/posters/placeholder.jpg";
import quietPlace from "../assets/images/posters/quiet-place.jpg";

const posters: { [key: string]: any } = {
  "dune: part two": dune,
  "godzilla x kong: the new empire": godzilla,
  "kingdom of the planet of the apes": apes,
  "ghostbusters: frozen empire": ghostbusters,
  "the fall guy": fallGuy,
  "a quiet place: day one": quietPlace,
  "inside out 2": insideOut2,
  "furiosa: a mad max saga": furiosa,
  "deadpool & wolverine": deadpool,
  "bad boys: ride or die": badBoys,
  "the garfield movie": garfield,
  "oppenheimer": oppenheimer,
};

export function getLocalPoster(title: string): any {
  const key = title?.trim().toLowerCase();
  return posters[key] || placeholder;
}
