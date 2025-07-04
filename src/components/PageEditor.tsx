
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "react-router-dom";

export default function PageEditor() {
  const { id } = useParams();
  
  // Mock data based on the page ID
  const getPageData = (pageId: string) => {
    switch (pageId) {
      case 'safety':
        return {
          title: 'Industry Safety Guidelines',
          slug: '/safety',
          content: '<h1>Industry Safety Guidelines</h1><p>Welcome to the Industry Safety Guidelines page. Here you will find essential information to ensure a safe working environment.</p><h2>Key Safety Principles</h2><ul><li>Always use appropriate Personal Protective Equipment (PPE)</li><li>Follow all operational procedures and protocols.</li><li>Report any hazards or incidents immediately.</li><li>Participate in regular safety training sessions.</li></ul><h2>Emergency Procedures</h2><p>In case of an emergency, please refer to the following resources:</p><ul><li><a href="#" style="color: var(--primary); text-decoration: none;" data-media-type="banani-button">Emergency Contact List</a></li><li><a href="#" style="color: var(--primary); text-decoration: none;" data-media-type="banani-button">Evacuation Routes Map</a></li></ul><p>For more detailed information, please visit our <a href="#" style="color: var(--primary); text-decoration: none;" data-media-type="banani-button">Safety Resources Portal</a>.</p>'
        };
      case 'terms':
        return {
          title: 'Terms and Conditions',
          slug: '/terms',
          content: '<h1>Terms and Conditions</h1><p>These terms and conditions govern your use of our platform.</p>'
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          slug: '/privacy',
          content: '<h1>Privacy Policy</h1><p>This privacy policy explains how we collect and use your personal information.</p>'
        };
      default:
        return {
          title: 'New Page',
          slug: '/new-page',
          content: '<h1>New Page</h1><p>Start editing your content here...</p>'
        };
    }
  };

  const pageData = getPageData(id || 'new');

  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center gap-4">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Page: {pageData.title}</h1>
          <p className="text-gray-600">Slug: {pageData.slug}</p>
        </div>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
            <Input className="border border-gray-200" defaultValue={pageData.title} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
            <Input className="border border-gray-200" defaultValue={pageData.slug} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <Textarea 
              className="min-h-64 border border-gray-200"
              defaultValue={pageData.content}
            />
          </div>

          <div className="flex gap-4 justify-end">
          <div className="flex gap-4 justify-end">
            <Button className="bg-slate-700 hover:bg-slate-800 text-white">
              Discard
            </Button>
            <Button className="bg-slate-800 hover:bg-slate-800 text-white">
              Preview Page
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white ">
              Save Changes
            </Button>
          </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
