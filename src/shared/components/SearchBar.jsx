import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { cn } from '../config/utils'

function SearchBar({ placeholder, value, onValueChange, className }) {
  return (
    <div className={cn("flex-1", className)}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onValueChange}
          className="pl-10 rounded-full bg-background dark:bg-background border-2 border-border focus:bg-background focus:border-primary transition-all h-10 w-full"
        />
      </div>
    </div>
  )
}

export default SearchBar