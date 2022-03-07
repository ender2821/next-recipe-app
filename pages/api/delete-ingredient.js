import { sanityClient } from "../../lib/sanity";

sanityClient.config ({
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function favoriteButtonHandler(req, res) {
  const { _id, ingredient } = JSON.parse(req.body);
  console.log(JSON.parse(req.body))
  console.log(ingredient, 'key-api')

  
  const ingredientToRemove = [`ingredient[_key=="${ingredient}"]` ]

  const data = await sanityClient.patch(_id).unset(ingredientToRemove).commit().catch((error) => console.log(error))
  res.status(200).json({ data })
}