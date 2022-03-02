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
      name: "tags",
      title: "Tags",
      type: "array",
      of:[
        {
          name: "tag",
          title: "Add a tag",
          type: "string",
        }
      ]
    }
  ]
}