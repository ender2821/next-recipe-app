import { sanityClientOld } from "../../lib/sanity";

sanityClientOld.config ({
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function favoriteButtonHandler(req, res) {
  const { _id } = JSON.parse(req.body);
  const data = await sanityClientOld
    .patch(_id)
    .setIfMissing({ favorite: false })
    .set({ favorite: true })
    .commit()
    .catch((error) => console.log(error))

  res.status(200).json({ favorite: data.favorite })
}