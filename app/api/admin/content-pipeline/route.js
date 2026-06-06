export async function POST() {
  return Response.json(
    {
      ok: false,
      disabled: true,
      reason: "Content generation is Discord/Hermes-only. Admin is review/edit/publish/delete only.",
    },
    { status: 410 }
  );
}
