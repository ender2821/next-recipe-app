import { sanityClient } from "../../lib/sanity";

sanityClient.config ({
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function favoriteButtonHandler(req, res) {
  const { _id } = JSON.parse(req.body);
  const data = await sanityClient
    .patch(_id)
    .setIfMissing({ favorite: false })
    .set({ favorite: false })
    .commit()
    .catch((error) => console.log(error))

  res.status(200).json({ favorite: data.favorite })
}