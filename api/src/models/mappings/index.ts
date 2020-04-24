enum RestDurationMapping { Low = 1, Medium, High }
enum CompanySizeMapping { Solo = 1, Little, Medium, Large }
enum RestCostMapping { Free = 1, Inexpensive, Moderate, Expensive, VeryExpensive }
enum RestTypesMapping { Active = 1, Passive }

enum RestPlaceCategoryMapping {
    AmusementPark = 1,
    Aquarium,
    ArtGallery,
    Bar,
    Cafe,
    Library,
    MovieTheater,
    Museum,
    NightClub,
    Park,
    Restaurant,
    Spa,
    Stadium,
    TouristAttraction,
    Zoo,
}

export {
    CompanySizeMapping,
    RestTypesMapping,
    RestCostMapping,
    RestDurationMapping,
    RestPlaceCategoryMapping,
};
