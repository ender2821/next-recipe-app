import { sanityClient } from "../../lib/sanity";

sanityClient.config ({
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function favoriteButtonHandler(req, res) {
  const { _id, ingredientKeys } = JSON.parse(req.body);

  const ingredientsToRemove = [`ingredient[${ingredientKeys}]`]

  const data = await sanityClient.patch(_id).unset(ingredientsToRemove).commit().catch((error) => console.log(error))
  res.status(200).json({ data })
}