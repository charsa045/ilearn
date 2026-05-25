"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

interface Props {
  claseId: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export default function CambiarImagenClase({
  claseId,
  imageUrl,
  imagePublicId,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "oldPublicId",
        imagePublicId || ""
      );

      const res = await fetch(
        `/api/clases/${claseId}/imagen`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
        );
      }

      router.refresh();

    } catch (error: any) {

      alert(
        error.message ||
        "Error actualizando imagen"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <label
      className="
        inline-flex
        items-center
        gap-2
        bg-white
        text-blue-700
        px-4
        py-2
        rounded-xl
        font-bold
        cursor-pointer
        hover:bg-blue-50
        transition
        shadow
      "
    >

      {loading
        ? "Actualizando..."
        : imageUrl
        ? "Cambiar foto"
        : "Agregar foto"}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

    </label>
  );
}