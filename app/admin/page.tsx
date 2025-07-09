"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="bg-orange-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
            <CardDescription className="text-orange-100">Assessment Response Management</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin Panel Coming Soon</h3>
              <p className="text-gray-600">
                This page will display all assessment responses and analytics when connected to a database.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
