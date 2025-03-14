// import { NextResponse } from "next/server";
// import { pool } from "@/lib/database";

// // GET all services
// export async function GET() {
//   const client = await pool.connect();
//   try {
//     const result = await client.query("SELECT * FROM service ORDER BY id ASC");
//     return NextResponse.json(result.rows);
//   } catch (err) {
//     console.error("Database error:", err);
//     return NextResponse.json(
//       { message: "Cannot find services", error: err.message },
//       { status: 500 }
//     );
//   } finally {
//     client.release();
//   }
// }

// // POST - create new service
// export async function POST(request) {
//   const client = await pool.connect();
//   try {
//     const { serviceName, description, price } = await request.json();

//     if (!serviceName || !description || !price) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Use prepared statements to prevent SQL injection
//     const query = {
//       text: "INSERT INTO service(service_name, description, price) VALUES($1, $2, $3) RETURNING *",
//       values: [serviceName, description, price],
//     };

//     const result = await client.query(query);
//     const savedService = result.rows[0];

//     return NextResponse.json(
//       {
//         message: "Service created",
//         service: savedService,
//       },
//       { status: 201 }
//     );
//   } catch (err) {
//     console.error("Database error:", err);
//     return NextResponse.json(
//       { message: "Error creating service", error: err.message },
//       { status: 500 }
//     );
//   } finally {
//     client.release(); // Important: release the client back to the pool
//   }
// }

// // PUT - update a service
// export async function PUT(request) {
//   const client = await pool.connect();
//   try {
//     const { id, serviceName, description, price } = await request.json();

//     if (!id || !serviceName || !description || !price) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const query = {
//       text: "UPDATE service SET service_name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
//       values: [serviceName, description, price, id],
//     };

//     const result = await client.query(query);

//     if (result.rowCount === 0) {
//       return NextResponse.json(
//         { message: "Service not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Service updated",
//       service: result.rows[0],
//     });
//   } catch (err) {
//     console.error("Database error:", err);
//     return NextResponse.json(
//       { message: "Error updating service", error: err.message },
//       { status: 500 }
//     );
//   } finally {
//     client.release();
//   }
// }

// // DELETE - delete a service
// export async function DELETE(request) {
//   const client = await pool.connect();
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { message: "Service ID is required" },
//         { status: 400 }
//       );
//     }

//     const query = {
//       text: "DELETE FROM service WHERE id = $1 RETURNING *",
//       values: [id],
//     };

//     const result = await client.query(query);

//     if (result.rowCount === 0) {
//       return NextResponse.json(
//         { message: "Service not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Service deleted successfully",
//     });
//   } catch (err) {
//     console.error("Database error:", err);
//     return NextResponse.json(
//       { message: "Error deleting service", error: err.message },
//       { status: 500 }
//     );
//   } finally {
//     client.release();
//   }
// }
