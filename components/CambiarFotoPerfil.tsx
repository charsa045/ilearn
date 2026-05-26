"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CambiarFotoPerfil({
  imageUrlActual,
}: {
  imageUrlActual?: string;
}) {

  const router = useRouter();

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState(imageUrlActual || "");

  const [loading, setLoading] =
    useState(false);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Debes seleccionar una imagen"
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "La imagen no debe superar los 5MB"
      );

      return;
    }

    setImageFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!imageFile) {

      alert(
        "Selecciona una imagen"
      );

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        imageFile
      );

      const res = await fetch(
        "/api/usuarios/foto",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
            "Error actualizando foto"
        );
      }

      alert(
        "Foto actualizada correctamente"
      );

      router.refresh();
      window.dispatchEvent(
    new Event("user-updated")
    );

    } catch (error: any) {

      console.error(error);

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        flex-col
        items-center
        gap-4
      "
    >

      <div
        className="
          w-32
          h-32
          rounded-full
          overflow-hidden
          border-4
          border-blue-500
          shadow-lg
          bg-gray-100
          flex
          items-center
          justify-center
        "
      >

        {preview ? (

          <img
            src={preview}
            alt="Preview"
            className="
              w-full
              h-full
              object-cover
            "
          />

        ) : (

          <span
            className="
              text-4xl
              font-bold
              text-blue-600
            "
          >
            ?
          </span>
        )}
      </div>

      {/* BOTÓN */}
      <label
        className="
          cursor-pointer
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-2
          rounded-lg
          font-semibold
          transition
          text-center
        "
      >

        {imageFile
          ? imageFile.name
          : "Seleccionar imagen"}

        <input
          type="file"
          accept="image/*"
          onChange={
            handleImageChange
          }
          className="hidden"
        />
      </label>

      {/* BOTÓN GUARDAR */}
      <button
        type="submit"
        disabled={
          loading || !imageFile
        }
        className="
          bg-emerald-600
          hover:bg-emerald-700
          text-white
          px-5
          py-2
          rounded-lg
          font-bold
          transition
          disabled:opacity-50
        "
      >

        {loading
          ? "Actualizando..."
          : "Actualizar foto"}
      </button>
    </form>
  );
}