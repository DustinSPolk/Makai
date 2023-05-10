USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByRece]    Script Date: 5/10/2023 11:59:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-14-2023
-- Description: Select Messages by Recipient User (Paginated)
-- Code Reviewer:

-- MODIFIED BY: Dustin Polk
-- MODIFIED DATE: 03-17-2023
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Messages_Select_ByRece]
	      @RecipientId int
	      ,@PageIndex int
	      ,@PageSize int

as

/* --- TEST ---

	DECLARE @RecipientId int = 8
			    ,@PageIndex int = 0
			    ,@PageSize int = 5

	EXECUTE [dbo].[Messages_Select_ByRece]
		      @RecipientId
		      ,@PageIndex
		      ,@PageSize

*/

BEGIN
	
	DECLARE @Offset int = @PageIndex * @PageSize

	SELECT m.Id
		  ,m.Message
		  ,m.Subject
		  ,m.RecipientId
			,ur.FirstName
			,ur.LastName
			,ur.Mi
			,ur.AvatarUrl
		  ,m.SenderId
			,us.FirstName
			,us.LastName
			,us.Mi
			,us.AvatarUrl
		  ,m.DateSent
		  ,m.DateRead
		  ,m.DateModified
		  ,m.DateCreated
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Messages] AS m
	INNER JOIN [dbo].[Users] as ur
	  ON m.RecipientId = ur.Id
	INNER JOIN [dbo].[Users] as us
	  ON m.SenderId = us.Id  

	WHERE @RecipientId = m.RecipientId

	ORDER BY DateCreated

	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END
