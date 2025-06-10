import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.type === "text" || e.target.type === "textarea") {
      setFormData({
        ...formData,
        // ! exemple: e.target.id = "name":string
        // ! but [e.target.id] = name : variable
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.type === "number") {
      setFormData({
        ...formData,
        [e.target.id]: parseInt(e.target.value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least 1 image");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price");
      }
      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(flase);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">
        Add a New Product
        {/* Create a Listing */}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        {/* left col */}
        <div className="flex flex-1 flex-col gap-4">
          <input
            type="text"
            id="title"
            placeholder="Product name"
            className="rounded-lg border p-3"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Describe the product, its benefits, and how it’s made"
            className="rounded-lg border p-3"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Origin / Producer’s location"
            className="rounded-lg border p-3"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <label htmlFor="sale">Edible</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Handmade</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor="parking">Pickup Available</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Packaged / Ready to use</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor="offer">Discounted Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms">Quantity</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Units per Pack</label>
            </div>
            <div className="flex w-full items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                className="w-2/5 rounded-lg border border-gray-300 p-3"
                min={50}
                max={100000}
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <label
                htmlFor="regularPrice"
                className="flex flex-col items-center"
              >
                <span>Regular price</span>
                {formData.type === "rent" && (
                  <span className="text-sm">($ / month)</span>
                )}
              </label>
            </div>
            {formData.offer && (
              <div className="flex w-full items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  className="w-2/5 rounded-lg border border-gray-300 p-3"
                  min={0}
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <label
                  htmlFor="discountPrice"
                  className="flex flex-col items-center"
                >
                  <span>Discounted price</span>
                  {formData.type === "rent" && (
                    <span className="text-sm">($ / month)</span>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>
        {/* right col */}
        <div className="flex flex-1 flex-col gap-4">
          <p className="flex flex-wrap font-semibold">
            <span>Images:</span>
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
              required
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
          <button
            disabled={loading || uploading}
            className="mt-3 rounded-lg bg-orange-700 p-3 uppercase text-white hover:opacity-95 hover:shadow disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
