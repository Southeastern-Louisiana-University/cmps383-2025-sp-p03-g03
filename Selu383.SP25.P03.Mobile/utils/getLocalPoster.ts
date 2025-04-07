// getLocalPoster.ts
import dune from "../app/assets/images/posters/dune.jpg";
import godzilla from "../app/assets/images/posters/godzilla-x-kong.jpg";
import apes from "../app/assets/images/posters/apes.jpg";
import ghostbusters from "../app/assets/images/posters/ghostbusters.jpg";
import fallGuy from "../app/assets/images/posters/fall-guy.jpg";
import quietPlace from "../app/assets/images/posters/quiet-place.jpg";
import insideOut2 from "../app/assets/images/posters/inside-out-2.jpg";
import furiosa from "../app/assets/images/posters/furiosa.jpg";
import deadpool from "../app/assets/images/posters/deadpool.jpg";
import badBoys from "../app/assets/images/posters/bad-boys.jpg";
import garfield from "../app/assets/images/posters/garfield.jpg";
import oppenheimer from "../app/assets/images/posters/oppenheimer.jpg";
import placeholder from "../app/assets/images/posters/placeholder.jpg";

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
  return posters[key] ?? placeholder;
}
