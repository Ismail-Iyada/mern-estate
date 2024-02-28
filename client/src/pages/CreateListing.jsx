import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { set } from "mongoose";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch((error) => {
          setImageUploadError("image upload failed (2MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing.");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-4 sm:flex-row">
        {/* left col */}
        <div className="flex flex-1 flex-col gap-4">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            className="rounded-lg border p-3"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            className="rounded-lg border p-3"
            required
          />
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            className="rounded-lg border p-3"
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" name="sale" id="sale" className="w-5" />
              <label htmlFor="sale">Sell</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
              />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>
            <div className="flex w-full items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                className="w-2/5 rounded-lg border border-gray-300 p-3"
                min={1}
                required
              />
              <label
                htmlFor="regularPrice"
                className="flex flex-col items-center"
              >
                <span>Regular price</span>
                <span className="text-sm">($ / month)</span>
              </label>
            </div>
            <div className="flex w-full items-center gap-2">
              <input
                type="number"
                name="discountPrice"
                id="discountPrice"
                className="w-2/5 rounded-lg border border-gray-300 p-3"
                min={1}
                required
              />
              <label
                htmlFor="discountPrice"
                className="flex flex-col items-center"
              >
                <span>Discounted price</span>
                <span className="text-sm">($ / month)</span>
              </label>
            </div>
          </div>
        </div>
        {/* right col */}
        <div className="flex flex-1 flex-col gap-4">
          <p className="font-semibold ">
            Images:
            <span className="ml-2 font-normal text-gray-500">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 ">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="w-full rounded border border-gray-300 p-3"
              type="file"
              id="images"
              accept="image/*"
              disabled={formData.imageUrls.length > 5}
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="rounded border border-green-700 p-3 uppercase text-green-700 hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-sm text-red-700">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className="flex items-center justify-between border p-3"
                key={"index" + index}
              >
                <img
                  src={url}
                  alt="listing image"
                  className="h-20 w-20 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="rounded-lg p-3 uppercase text-red-700 hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="mt-3 rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-95 hover:shadow disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
