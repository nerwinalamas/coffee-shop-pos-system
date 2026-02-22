-- Create the storage bucket
insert into storage.buckets (id, name, public)
values ('product_images', 'product_images', true)
on conflict (id) do nothing;

-- Allow anyone to upload (for development only!)
create policy "Anyone can upload images"
on storage.objects for insert
to public
with check (bucket_id = 'product_images');

-- Allow anyone to update images (for development only!)
create policy "Anyone can update images"
on storage.objects for update
to public
using (bucket_id = 'product_images');

-- Allow anyone to delete images (for development only!)
create policy "Anyone can delete images"
on storage.objects for delete
to public
using (bucket_id = 'product_images');
