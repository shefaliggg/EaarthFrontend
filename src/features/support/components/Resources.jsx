import { FileText, Video, Book, ExternalLink, Mail, Phone } from 'lucide-react';

export default function Resources({ resources }) {
  const getIcon = (type) => {
    const icons = {
      Guide: FileText,
      Video: Video,
      Documentation: Book
    };
    return icons[type] || Book;
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {resources.map((resource) => {
          const Icon = getIcon(resource.type);
          return (
            <div
              key={resource.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg text-foreground">{resource.title}</h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{resource.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/10 rounded">{resource.type}</span>
                    <span>{resource.category}</span>
                    <span>•</span>
                    <span>{resource.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-lg p-8">
        <h3 className="text-xl mb-6 text-foreground">Contact Support</h3>
        <div className="grid grid-cols-2 gap-6">
          <a
            href="mailto:support@eaarthstudios.com"
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="mb-1 text-foreground">Email Support</h4>
              <p className="text-sm text-muted-foreground">support@eaarthstudios.com</p>
              <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
            </div>
          </a>
          <a
            href="tel:+1234567890"
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <div className="p-3 bg-primary/10 rounded-lg">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="mb-1 text-foreground">Phone Support</h4>
              <p className="text-sm text-muted-foreground">+1 (234) 567-8900</p>
              <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9AM-6PM EST</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}