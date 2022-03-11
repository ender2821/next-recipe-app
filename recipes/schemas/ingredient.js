export default {
  name: "ingredient",
  title: "Ingredient",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Ingedient Name",
      type: "string"
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      }
    },
    {
      name: "notes",
      title: "Notes",
      type: "text"
    },
    {
      name: "section",
      title: "Supermarket Section",
      type: "string",
      options: {
        list: ["dairy", "produce", "meat", "canned", "dry", "spices", "frozen", "snack", "alcohol", "baking", "condiment", "bread", "beverage", "misc"].sort()
      }
    }
  ]
}