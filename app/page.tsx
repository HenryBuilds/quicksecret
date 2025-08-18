export const dynamic = "force-dynamic";

import { rpc } from "@/lib/rpc";
import React from "react";

const page = async () => {
  const { data } = await rpc.api.get();

  return <div>{data}</div>;
};

export default page;
