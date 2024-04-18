Hi,

CatalogList manager:
To run an application in the terminal type "docker compose up -d"
To check swagger move to "http://localhost:3000/api/docs"

List of endpoints(for more datails go to swagger):
GET catalogs - get all catalogs
GET catalogs:id - get a catalog by id
POST catalogs - to create a catalog
PATCH catalogs:id - to change/update catalog
DELETE catalogs:id - to delete a single catalog
DELETE catalogs/bulk-delete - delete a few catalogs from the list in a bulk action